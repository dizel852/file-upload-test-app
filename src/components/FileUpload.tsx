import {useState, useRef} from "react";
import * as tus from "tus-js-client";
import styles from  './FileUpload.module.scss'

const startOrResumeUpload = (upload: any) => {
    upload.findPreviousUploads().then(function (previousUploads: any) {
        if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0])
        }
        upload.start()
    })
}

const createTusUploadInstance = (file:  File, uploadPath: string) => {
    // @ts-ignore
    const upload = new tus.Upload(file, {
        endpoint: uploadPath,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: file.name,
            filetype: file.type
        },
        onError: (error) => console.log("Failed because: " + error),
        onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: () => console.log("Download %s from %s", upload.file.name, upload.url)
    })
    return upload
}


const FileUpload = () => {
    const [uploadPath, setUploadPath] = useState(window.location.href);
    const fileInputEl = useRef<HTMLInputElement>(null);
    let uploadInst: any;

    const handleFileUpload = () => {
        if (!fileInputEl.current?.files?.length) {
            console.log('No file selected');
            return;
        }
        const [file] = Array.from(fileInputEl.current.files)
        console.dir(file)

        uploadInst = createTusUploadInstance(file, uploadPath)
        uploadInst.findPreviousUploads().then(function (previousUploads: string | any[]) {
            if (previousUploads.length) {
                uploadInst.resumeFromPreviousUpload(previousUploads[0])
            }
            uploadInst.start()
        })
    }

    const handlePause = () => {
        if (!uploadInst) {
            console.log("There is no tus instance");
            return;
        }
        console.log("Pause uploading")
        uploadInst.abort()
    }
    const handleUnpause = () => {
        if (!uploadInst) {
            console.log("There is no tus instance");
            return;
        }
        console.log("Unpause uploading")
        startOrResumeUpload(uploadInst)
    }

    return (
        <div className={styles.container}>
            <div className={styles.uploadPath}>
                <label htmlFor="uploadPath">Upload path</label>
                <input type="text" id="uploadPath" value={uploadPath} onChange={({target: {value}}) => setUploadPath(value)} />
            </div>
            <div className={styles.selectFile}>
                <label htmlFor="selectedFile">Select a file</label>
                <input
                    type="file"
                    id="selectedFile"
                    ref={fileInputEl} />

                </div>
            <div className={styles.uploadBtn}>
                <button onClick={handleFileUpload}>Upload file</button>
                <button onClick={handlePause}>Pause file uploading</button>
                <button onClick={handleUnpause}>Unpause file uploading</button>

            </div>
        </div>
    )
}

export default FileUpload