/*
    The code in this file is largely taken from the examples found here:
    https://docs.opencv.org/4.x/df/d6c/tutorial_js_face_detection_camera.html
    https://docs.opencv.org/4.x/d2/d99/tutorial_js_face_detection.html
*/
const OPENCV_URL = "https://docs.opencv.org/3.4.0/opencv.js";
loadOpenCv = function(onloadCallback) {
    let script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.addEventListener('load', async () => {
        if (cv && cv.getBuildInformation)
        {
            console.log(cv.getBuildInformation());
            onloadCallback();
        }
        else
        {
            // WASM
            if (cv instanceof Promise) {
                cv = await cv;
                console.log(cv.getBuildInformation());
                onloadCallback();
            } else {
                cv['onRuntimeInitialized']=()=>{
                    console.log(cv.getBuildInformation());
                    onloadCallback();
                }
            }
        }
    });
    script.addEventListener('error', () => {
        console.error('Failed to load ' + OPENCV_URL);
    });
    script.src = OPENCV_URL;
    let node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(script, node);
};

createFileFromUrl = function(path, url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(ev) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let data = new Uint8Array(request.response);
                cv.FS_createDataFile('/', path, data, true, false, false);
                callback();
            } else {
                console.error('Failed to load ' + url + ' status: ' + request.status);
            }
        }
    };
    request.send();
};