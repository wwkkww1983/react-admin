import request from "../utils/request";

/**
 * 上传图片 
 */
export function uploadImg (formData) {
    return request({
        headers: {
            "Content-Type": "multipart/form-data"
        },
        url: "/upload/adminUpload",
        method: "POST",
        data: formData
    });
}