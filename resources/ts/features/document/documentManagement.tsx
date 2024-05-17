import axios, { AxiosError, AxiosResponse } from 'axios';
import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import { MuiFileInput } from 'mui-file-input';
import Button from '@mui/material/Button';
import { RiDeleteBin5Line } from 'react-icons/ri';
import SelectBox from './../../components/SelectBox';
import { textColor } from '../../utils/themeClient';


const DocumentManagement = () => {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
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

        setIsUploading(true)

        const promises: Promise<void>[] = selectedFiles.map(async (selectedFile) => {
            try {
                const presignedUrl = await axios({
                    url: '/api/v1/document/image/presigned-url',
                    method: 'POST',
                    params: {
                        document_name: selectedDocument,
                        file_name: selectedFile.name,
                        extension: getExtension(selectedFile.name),
                        size: selectedFile.size,
                    }
                })
                .then((res) => res.data)

                console.log(`${selectedFile.name}の署名付きURL`, presignedUrl)

                // MEMO::なぜかaxiosがこの書き方じゃないとうまくS3に保存できない（リクエストは成功するが何も保存されない）
                const result = await axios.put(presignedUrl, selectedFile)

                const newSelectedFiles: File[] = deleteSelectedFile(selectedFile.name)
                setSelectedFiles(newSelectedFiles)

                console.log(`%c${selectedFile.name}のS3アップロード結果`, 'color: green;', result)
            } catch (e) {
                console.log(`%c${selectedFile.name}でエラー発生: `, `color: ${textColor.error};`, e)
                // response.data.message
            }
        })

        await Promise.allSettled(promises)

        setSelectedFiles([])
        setIsUploading(false)
    }

    /**
     * 画像ファイルの選択・追加
     */
    const addSelectedFiles = (files: File[]) => {
        if (selectedFiles.length === 0) {
            setSelectedFiles(files)
            return
        }

        const newSelectedFiles = [...selectedFiles].concat(files)

        const duplicateFileNames = checkDuplicate(newSelectedFiles)
        if (duplicateFileNames.length > 0) {
            const errorMessage = makeDuplicateErrorMessage(duplicateFileNames)
            setErrorMessage(errorMessage)
        }

        setSelectedFiles(newSelectedFiles)
    }

    /**
     * 選択した画像ファイルの削除
     */
    const deleteSelectedFile = (targetFileName: string) => {

        const selectedFileNames: string[] = selectedFiles.map((selectedFile) => {
            return selectedFile.name
        })

        return selectedFiles.filter((selectedFile: File, i: number) => {
            const isTarget = selectedFile.name === targetFileName
            const isDuplicate
                = selectedFileNames.indexOf(targetFileName) === i && i !== selectedFileNames.lastIndexOf(targetFileName)

            // 削除target以外は残す、 削除targetだとしてもそれが重複してるなら一つは残す
            return (!isTarget) || (isTarget && isDuplicate)
        })
    }

    /**
     * 選択した画像ファイルの重複チェック
     */
    const checkDuplicate = (selectedFiles: File[]) => {
        const selectedFileNames = selectedFiles.map((newSelectedFile) => {
            return newSelectedFile.name
        })

        const duplicateFileNames: string[] = selectedFileNames.filter(
            (selectedFileName: string, i: number, self: string[]) => {
                return self.indexOf(selectedFileName) === i && i !== self.lastIndexOf(selectedFileName);
            })

        return duplicateFileNames
    }

    /**
     * 画像ファイルの重複に関するエラーメッセージの作成
     */
    const makeDuplicateErrorMessage = (duplicateFileNames: string[]) => {
        let message: string = ''
        duplicateFileNames.forEach((duplicateFileName: string) => {
            message += `・${duplicateFileName}\n`
        });

        message = `${message}が重複しています。`

        return message
    }

    /**
     * 削除アイコン押下時の処理
     */
    const handleClickDeleteIcon = (targetFileName: string) => {
        const newSelectedFiles: File[] = deleteSelectedFile(targetFileName)

        const duplicateFileNames = checkDuplicate(newSelectedFiles)
        if (duplicateFileNames.length > 0) {
            const errorMessage = makeDuplicateErrorMessage(duplicateFileNames)
            setErrorMessage(errorMessage)
        } else {
            setErrorMessage('')
        }

        setSelectedFiles(newSelectedFiles)
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
                value={selectedFiles}
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
                disabled={selectedFiles.length === 0 || isUploading || errorMessage !== ''}
            >
                アップロード
            </Button>

            <ul>
                {selectedFiles.map((selectedFile, i) => {
                    return (
                        <li key={i}>
                            {selectedFile.name}
                            <button onClick={() => {handleClickDeleteIcon(selectedFile.name)}}><RiDeleteBin5Line /></button>
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
