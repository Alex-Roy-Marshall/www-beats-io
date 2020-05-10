import React, {useState} from "react";

const useBufferLoader = () => {
	const[files, setFiles] = useState(null);
	const[loadingError, setLoadingError] = useState(null);

	const loadFiles = (context, urlList) => {
		let files = {};
		for(const property in urlList){
			files[property] = null;

			let request = new XMLHttpRequest();
			request.open("GET", urlList[property], true);
			request.responseType = "arraybuffer";
			request.onload = function(){
				context.decodeAudioData(
					request.response,
					function(buffer) {
						files[property]=buffer;
					},
					function(error){
						console.log('err1');
						console.log(error);
						setLoadingError(error);
					}
				);
			}
			request.onerror = function(){
				console.log('err2');
				setLoadingError("XHR error");
			}
			request.send();
		}
		setFiles(files);

	}

	return [loadFiles, {files, loadingError}]
}

export default useBufferLoader;