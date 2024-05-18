import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import { MuiFileInput } from 'mui-file-input';
import Button from '@mui/material/Button';
import { RiDeleteBin5Line } from 'react-icons/ri';
import SelectBox from './../../components/SelectBox';
import { textColor } from '../../utils/themeClient';


type FileItem = {
    id: string,
    fileName: string,
    value: File,
    errorMessage: string,
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

        const promises: Promise<void>[] = selectedFileItems.map(async (selectedFileItem) => {
            try {
                const presignedUrl = await axios({
                    url: '/api/v1/document/image/presigned-url',
                    method: 'POST',
                    params: {
                        document_name: selectedDocument,
                        file_name: selectedFileItem.fileName,
                        extension: getExtension(selectedFileItem.value.name),
                        size: selectedFileItem.value.size,
                    }
                })
                .then((res) => res.data)

                console.log(`${selectedFileItem.fileName}の署名付きURL`, presignedUrl)

                // MEMO::なぜかaxiosがこの書き方じゃないとうまくS3に保存できない（リクエストは成功するが何も保存されない）
                const result = await axios.put(presignedUrl, selectedFileItem)

                const newSelectedFileItems: FileItem[] = deleteSelectedFile(selectedFileItem.fileName)
                setSelectedFileItems(newSelectedFileItems)

                console.log(`%c${selectedFileItem.fileName}のS3アップロード結果`, 'color: green;', result)
            } catch (e) {
                console.log(`%c${selectedFileItem.fileName}でエラー発生: `, `color: ${textColor.error};`, e)
                // response.data.message
            }
        })

        await Promise.allSettled(promises)

        setSelectedFileItems([])
        setIsUploading(false)
    }

    /**
     * 画像ファイルの選択・追加
     */
    const addSelectedFiles = (files: File[]) => {
        const MAX_SIZE = 10485760

        const fileItems = files.map((file: File, i: number) => {
            let errorMessage: string = ''

            if (file.size > MAX_SIZE) {
                errorMessage = `サイズが${(MAX_SIZE / 1024) / 1024}MBを超えています。`
            }

            const extension: string = getExtension(file.name)
            const ALLOW_EXTENSIONS: string[] = ['png', 'svg', 'jpeg', 'jpg']
            const isAllowExtension: boolean = ALLOW_EXTENSIONS.includes(extension)
            if (!isAllowExtension) {
                errorMessage += `拡張子${extension}は使用できません。`
            }

            return {
                id: `${i}`,
                fileName: file.name,
                value: file,
                errorMessage: errorMessage
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
                            {selectedFileItem.fileName}
                            <button onClick={() => { handleClickDeleteIcon(selectedFileItem.fileName) }}><RiDeleteBin5Line /></button>
                            {selectedFileItem.errorMessage !== '' &&
                                <p style={{ color: textColor.error }}>{selectedFileItem.errorMessage}</p>
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
