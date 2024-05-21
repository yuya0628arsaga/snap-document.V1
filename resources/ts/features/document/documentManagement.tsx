import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { ChangeEvent, useState } from 'react'
import { MuiFileInput } from 'mui-file-input';
import Button from '@mui/material/Button';
import { RiDeleteBin5Line } from 'react-icons/ri';
import SelectBox from './../../components/SelectBox';
import { textColor } from '../../utils/themeClient';
import TextField from '@mui/material/TextField';


type FileItem = {
    id: string,
    fileName: string,
    value: File,
    errorMessage: string,
    inputFileNameErrorMessage: string,
}

const DocumentManagement = () => {

    const [selectedFileItems, setSelectedFileItems] = useState<FileItem[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isSelectDocument, setIsSelectDocument] = useState(true)
    const [selectedDocument, setSelectedDocument] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    /**
     * 選択した画像ファイルの拡張子取得
     */
    const getExtension = (fileName: string) => {
        const fileNameArray = fileName.split('.')
        if (fileNameArray.length <= 1) return ''
        return fileNameArray.pop() ?? ''
    }

    /**
     * 拡張子を除いた画像ファイル名を取得
     */
     const removeExtension = (fileName: string) => {
        const fileNameArray = fileName.split('.')
        return fileNameArray[0]
    }

    /**
     * 選択した画像ファイルをアップロード
     */
    const uploadSelectedFiles = async () => {
        if (!selectedDocument) {
            setIsSelectDocument(false)
            return
        }
        if (isUploading) return

        setErrorMessage('')
        setIsUploading(true)

        const promises: Promise<void | FileItem>[] = selectedFileItems.map(async (selectedFileItem: FileItem) => {
            try {
                const imageName = removeExtension(selectedFileItem.fileName)

                const presignedUrl = await axios({
                    url: '/api/v1/document/image/presigned-url',
                    method: 'POST',
                    params: {
                        document_name: selectedDocument,
                        file_name: imageName,
                        extension: getExtension(selectedFileItem.value.name),
                        size: selectedFileItem.value.size,
                    }
                })
                .then((res: AxiosResponse) => res.data)

                console.log(`${selectedFileItem.fileName}の署名付きURL`, presignedUrl)

                // MEMO::なぜかaxiosがこの書き方じゃないとうまくS3に保存できない（リクエストは成功するが何も保存されない）
                const result = await axios.put(presignedUrl, selectedFileItem.value)

                console.log(`%c${selectedFileItem.fileName}のS3へのupload 成功`, 'color: green;', result)
            } catch (e: any) {
                console.log(`%c${selectedFileItem.fileName}でupload error 発生: `, `color: ${textColor.error};`, e)
                return { ...selectedFileItem, errorMessage: `Upload Error: ${e.response.data.message}` }
            } finally {
                // アップロード済みのファイルを画面から削除
                const newSelectedFileItems: FileItem[] = deleteSelectedFile(selectedFileItem.fileName)
                setSelectedFileItems(newSelectedFileItems)
            }
        })

        const results: PromiseSettledResult<void | FileItem>[] = await Promise.allSettled(promises)
        const failUploadFileItems: FileItem[] = getFailUploadFileItems(results)

        // アップロードに失敗したファイルを残す
        setSelectedFileItems(failUploadFileItems)
        setIsUploading(false)
    }

    /**
     * アップロードに失敗したファイル一覧を取得
     */
    const getFailUploadFileItems = (promiseResults: PromiseSettledResult<void | FileItem>[]) => {
        const failResults: PromiseSettledResult<void | FileItem>[] = promiseResults.filter(
            (result: any) => {
                return typeof result.value !== 'undefined'
            })

        return failResults.map((failResult: any) => {
            return failResult.value
        })
    }

    /**
     * 画像ファイルの選択・追加
     */
    const addSelectedFiles = (files: File[]) => {
        const fileItems = files.map((file: File, i: number) => {
            let errorMessage: string = ''

            errorMessage = validateFilesSize(file, errorMessage)
            errorMessage = validateFilesExtension(file, errorMessage)
            const uuid = Math.random().toString(36).slice(-8)

            return {
                id: uuid,
                fileName: file.name,
                value: file,
                errorMessage: errorMessage,
                inputFileNameErrorMessage: ''
            }
        })
        // 最初にFile選択をする段階では重複チェックをしなくてよい
        if (! selectedFileItems.length) {
            setSelectedFileItems(fileItems)
            return
        }

        const newSelectedFileItems: FileItem[] = [...selectedFileItems].concat(fileItems)
        validateFilesDuplicate(newSelectedFileItems)

        setSelectedFileItems(newSelectedFileItems)
    }

    /**
     * 選択した画像ファイルの削除
     */
    const deleteSelectedFile = (targetFileName: string) => {

        const selectedFileNames: string[] = selectedFileItems.map((selectedFileItem) => {
            return selectedFileItem.fileName
        })

        return selectedFileItems.filter((selectedFileItem: FileItem, i: number) => {
            const isTarget = selectedFileItem.fileName === targetFileName
            const isDuplicate
                = selectedFileNames.indexOf(targetFileName) === i && i !== selectedFileNames.lastIndexOf(targetFileName)

            // 削除target以外は残す、 削除targetだとしてもそれが重複してるなら一つは残す
            return (!isTarget) || (isTarget && isDuplicate)
        })
    }

    /**
     * 選択した画像ファイルの重複チェック
     */
    const getDuplicateFileNames = (selectedFileItems: FileItem[]) => {
        const selectedFileNames: string[] = selectedFileItems.map((newSelectedFile: FileItem) => {
            return newSelectedFile.fileName
        })

        const duplicateFileNames: string[] = selectedFileNames.filter(
            (selectedFileName: string, i: number, self: string[]) => {
                return self.indexOf(selectedFileName) === i && i !== self.lastIndexOf(selectedFileName);
            })

        return duplicateFileNames
    }

    /**
     * 画像ファイルに関するエラーメッセージの作成
     */
    const makeFileErrorMessage = (fileNames: string[]) => {
        let message: string = ''

        fileNames.forEach((fileName: string) => {
            message += `・${fileName}\n`
        });

        return message
    }

    /**
     * 重複エラーメッセージの作成
     */
    const makeDuplicateFileErrorMessage = (fileNames: string[]) => {
        return `${makeFileErrorMessage(fileNames)}が重複しています。\n`
    }

    /**
     * 選択した画像ファイルの重複バリデーション
     */
    const validateFilesDuplicate = (selectedFileItems: FileItem[]) => {
        const duplicateFileNames = getDuplicateFileNames(selectedFileItems)

        if (duplicateFileNames.length) {
            const validationMessage: string = makeDuplicateFileErrorMessage(duplicateFileNames)

            setErrorMessage(validationMessage)
        } else {
            setErrorMessage('')
        }
    }

    /**
     * 選択した画像ファイルのsizeバリデーション
     */
    const validateFilesSize = (file: File, errorMessage: string) => {
        const MAX_SIZE = 10485760

        if (file.size > MAX_SIZE) {
            errorMessage += `サイズが${(MAX_SIZE / 1024) / 1024}MBを超えています。`
        }

        return errorMessage
    }

    /**
     * 選択した画像ファイルの拡張子バリデーション
     */
    const validateFilesExtension = (file: File, errorMessage: string) => {
        const ALLOW_EXTENSIONS: string[] = ['png', 'svg', 'jpeg', 'jpg']

        const extension: string = getExtension(file.name)
        const isAllowExtension: boolean = ALLOW_EXTENSIONS.includes(extension)

        if (!isAllowExtension) {
            errorMessage += `拡張子${extension}は使用できません。`
        }

        return errorMessage
    }

    /**
     * 削除アイコン押下時の処理
     */
    const handleClickDeleteIcon = (targetFileName: string) => {
        const newSelectedFileItems: FileItem[] = deleteSelectedFile(targetFileName)

        validateFilesDuplicate(newSelectedFileItems)

        setSelectedFileItems(newSelectedFileItems)
    }

    /**
     * 選択したファイルたちにエラーが含まれているか否か
     */
    const isError = (): boolean => {
        const hasErrorFiles: FileItem[] = selectedFileItems.filter((selectedFileItem) => {
            return selectedFileItem.errorMessage
        })
        return errorMessage !== '' || hasErrorFiles.length > 0
    }

    /**
     * 画像ファイル名を変更
     */
    const handleChangeFileNameInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, targetFileId: string) => {
        const editedSelectedFileItems = selectedFileItems.map((selectedFileItem) => {
            return selectedFileItem.id === targetFileId
                ? { ...selectedFileItem, fileName: e.target.value }
                : selectedFileItem
        })

        setSelectedFileItems(editedSelectedFileItems)
    }

    /**
     * 画像ファイル名の文字数チェック
     */
    const handleOnBlurFileNameInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, targetFileId: string) => {
        const inputImageName = e.target.value
        const imageName = removeExtension(inputImageName)

        const editedSelectedFileItems = selectedFileItems.map((selectedFileItem) => {
            return selectedFileItem.id === targetFileId
                ? {
                    ...selectedFileItem,
                    errorMessage:
                        imageName === ''
                        ? selectedFileItem.inputFileNameErrorMessage = 'ファイル名は1文字以上で指定してください。'
                        : ''
                }
                : selectedFileItem
        })

        setSelectedFileItems(editedSelectedFileItems)
    }

    return (
        <>
            <h1>documentページ</h1>
            <SelectBox
                isSelectManual={isSelectDocument}
                setIsSelectManual={setIsSelectDocument}
                manual={selectedDocument}
                setManual={setSelectedDocument}
            />

            <MuiFileInput
                placeholder={'ファイルを選択してください（複数可）'}
                value={selectedFileItems.map((selectedFileItem) => selectedFileItem.value)}
                onChange={(files) => addSelectedFiles(files)}
                multiple
                inputProps={{ accept: 'image/*' }}
                disabled={isUploading}
                sx={{
                    '.MuiFileInput-placeholder': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    },
                }}
            />

            <Button
                variant="contained"
                onClick={uploadSelectedFiles}
                disabled={! selectedFileItems.length || isUploading || isError()}
            >
                アップロード
            </Button>

            <ul>
                {selectedFileItems.map((selectedFileItem, i) => {
                    return (
                        <li key={i}>
                            <TextField id="outlined-basic" value={selectedFileItem.fileName} onChange={(e) => { handleChangeFileNameInput(e, selectedFileItem.id) }} onBlur={(e) => {handleOnBlurFileNameInput(e, selectedFileItem.id)}}/>
                            <button onClick={() => { handleClickDeleteIcon(selectedFileItem.fileName) }}><RiDeleteBin5Line /></button>
                            {selectedFileItem.errorMessage !== '' &&
                                <p style={{ color: textColor.error }}>{selectedFileItem.errorMessage}</p>
                            }
                            {selectedFileItem.inputFileNameErrorMessage !== '' &&
                                <p style={{ color: textColor.error }}>{selectedFileItem.inputFileNameErrorMessage}</p>
                            }
                        </li>
                    )
                })}
            </ul>
            {errorMessage &&
                <>
                    <div style={{ color: textColor.error }}>
                        {/* Fix::改行反映のため */}
                        {errorMessage.split("\n").map((message, index) => {
                            return (
                                <React.Fragment key={index}>{message}<br /></React.Fragment>
                            )
                        })}
                    </div>
                </>}
        </>
    )
}

export default DocumentManagement

const element = document.getElementById('document-management')
if (element) {
  const props = element.dataset.props
  const reactProps = props ? JSON.parse(props) : null
  createRoot(element).render(<DocumentManagement {...reactProps}/>)
}
