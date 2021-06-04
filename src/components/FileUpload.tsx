import {useState, useRef} from "react";
import styles from  './FileUpload.module.scss'

const FileUpload = () => {

    const [uploadPath, setUploadPath] = useState(window.location.href);
    const fileInputEl = useRef<HTMLInputElement>(null);

    const handleFileUpload = () => {
        if (!fileInputEl.current?.files?.length) {
            console.log('No file selected');
            return;
        }
        const [file] = Array.from(fileInputEl.current.files)
        console.log('Uploading')
        console.log(file)
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
                <button
                    type="submit"
                    onClick={handleFileUpload}>Upload file</button>
            </div>
        </div>
    )
}

export default FileUpload