import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { UploadService } from './upload.service';

describe('FileController', () => {
  let fileController: FileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [UploadService]
    }).compile();

    fileController = app.get<FileController>(FileController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fileController.getHello()).toBe('Hello World!');
    });
  });
});
