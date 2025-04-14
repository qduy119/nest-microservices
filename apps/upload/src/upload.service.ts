import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Duplex } from 'stream';

@Injectable()
export class UploadService {
  async upload(
    file: Express.Multer.File,
    folder = 'upload'
  ): Promise<{
    url: string;
    secureUrl: string;
  }> {
    try {
      const uploadResponse: UploadApiErrorResponse | UploadApiResponse =
        await new Promise((resolve, reject) => {
          const uploadStream = v2.uploader.upload_stream(
            { resource_type: 'auto', folder },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          this.bufferToStream(file.buffer).pipe(uploadStream);
        });
      const { url, secure_url } = uploadResponse;
      return { url, secureUrl: secure_url };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  private bufferToStream(buffer: Buffer) {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
