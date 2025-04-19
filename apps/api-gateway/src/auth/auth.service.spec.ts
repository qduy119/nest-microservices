import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient
} from '@app/shared/proto/auth';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let grpcClient: jest.Mocked<ClientGrpc>;
  let authServiceMock: jest.Mocked<AuthServiceClient>;

  beforeEach(async () => {
    // Create mock for gRPC service methods
    const authServiceMock = {
      login: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn()
    };

    // Create mock for gRPC client
    const grpcClient = {
      getService: jest.fn().mockReturnValue(authServiceMock)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AUTH_PACKAGE_NAME,
          useValue: grpcClient
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Now we can verify that getService is called correctly
    service.onModuleInit();
    expect(grpcClient.getService).toHaveBeenCalledWith(AUTH_SERVICE_NAME);
  });

  it('should properly initialize gRPC service', () => {
    expect(grpcClient.getService).toHaveBeenCalledWith(AUTH_SERVICE_NAME);
    expect(service['authService']).toBe(authServiceMock); // Testing private property initialization
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', () => {
      const loginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };
      const expectedResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };

      authServiceMock.login.mockReturnValue(of(expectedResponse));

      service.login(loginRequest).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(authServiceMock.login).toHaveBeenCalledWith(loginRequest);
      });
    });

    it('should handle login service errors', () => {
      const loginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginRequest).subscribe({
        error: (err) => {
          expect(err.status).toBe(403);
        }
      });
    });
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', () => {
      const registerRequest = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };
      const expectedResponse = {
        isRegistered: true
      };

      authServiceMock.register.mockReturnValue(of(expectedResponse));

      service.register(registerRequest).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(authServiceMock.register).toHaveBeenCalledWith(registerRequest);
      });
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken with correct parameters', () => {
      const refreshRequest = {
        refreshToken: 'refresh-token'
      };
      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      };

      authServiceMock.refreshToken.mockReturnValue(of(expectedResponse));

      service.refreshToken(refreshRequest).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
          refreshRequest
        );
      });
    });
  });

  describe('gRPC client initialization', () => {
    it('should properly handle gRPC client initialization failure', () => {
      // Simulate gRPC client initialization failure
      grpcClient.getService.mockImplementation(() => {
        throw new Error('Failed to initialize gRPC client');
      });

      expect(() => {
        service.onModuleInit();
      }).toThrow('Failed to initialize gRPC client');
    });

    it('should handle missing gRPC service', () => {
      grpcClient.getService.mockReturnValue(null);

      expect(() => {
        service.onModuleInit();
      }).toThrow();
    });
  });
});
