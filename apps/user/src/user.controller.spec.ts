import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return user 1', async () => {
      expect(await userController.getUserById({ id: '1' })).toBe(
        'Hello World!'
      );
    });
  });
});
