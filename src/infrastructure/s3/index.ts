import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { appEnv } from "@shared/constants/env";


const s3 = new S3Client({
    region: appEnv.AWS_REGION,
    endpoint: `https://s3.${appEnv.AWS_REGION}.amazonaws.com`,
    credentials: {
        accessKeyId: appEnv.AWS_ACCESS_KEY_ID,
        secretAccessKey: appEnv.AWS_SECRET_ACCESS_KEY,
    },
})


export const uploadFile = async (file: {file: any, mimeType: string, fileName: string}) => {
    const {file: fileStream, mimeType, fileName} = file;
    const uploadParams = {
        Bucket: appEnv.AWS_S3_BUCKET_NAME,
        Key: `${fileName}/${new Date().getTime()}`,
        Body: fileStream,
        ContentType: mimeType,
    }
    await s3.send(new PutObjectCommand(uploadParams));

    return uploadParams.Key;
}

export const getFileBykey = async (key: string) => {
    const params = {
        Bucket: appEnv.AWS_S3_BUCKET_NAME,
        Key: key,
    }
    const {Body} = await s3.send(new GetObjectCommand(params));

    return Body;
}