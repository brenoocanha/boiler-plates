import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaConnection } from 'src/infra/database/prisma-connection';
import { stripeServiceMock } from '../mocks/stripe-service.mock';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { signupMockDTO } from '../mocks/signup-dto.mock';

describe('AuthService (integration)', () => {
  let prisma: PrismaConnection;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider('StripeService')
      .useValue(stripeServiceMock)
      .compile();

    prisma = moduleRef.get(PrismaConnection);
    authService = moduleRef.get(AuthService);
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.users.deleteMany();
  });

  describe('signUp()', () => {
    it('should create a new user', async () => {
      const user = await authService.signUp(signupMockDTO);

      expect(user).toBeDefined();
      expect(user.user.email).toBe(signupMockDTO.email);
      expect(user.user.name).toBe(signupMockDTO.name);
      expect(user.user.is_confirmed).toBe(false);

      expect(user.stripeCustomer).toBeDefined();
      expect(user.stripeCustomer.id).toBeDefined();
      expect(user.stripeCustomer.address.city).toBe(signupMockDTO.address.city);
      expect(user.stripeCustomer.address.country).toBe(
        signupMockDTO.address.country,
      );
      expect(user.stripeCustomer.address.line1).toBe(
        signupMockDTO.address.line1,
      );
      expect(user.stripeCustomer.address.line2).toBe(
        signupMockDTO.address.line2,
      );
      expect(user.stripeCustomer.address.postal_code).toBe(
        signupMockDTO.address.postal_code,
      );
      expect(user.stripeCustomer.address.state).toBe(
        signupMockDTO.address.state,
      );
      expect(user.stripeCustomer.email).toBe(signupMockDTO.email);
      expect(user.stripeCustomer.metadata.cpfCnpj).toBe(signupMockDTO.cpfCnpj);
      expect(user.stripeCustomer.metadata.name).toBe(signupMockDTO.name);
      expect(user.stripeCustomer.metadata.phone).toBe(signupMockDTO.phone);
    });

    it('should throw an error if the email is already in use', async () => {
      try {
        await authService.signUp(signupMockDTO);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('Email already exists');
      }
    });
  });

  describe('signIn()', () => {
    it('should return an access_token and a refresh_token', async () => {
      const signInDTO: SignInDto = {
        email: signupMockDTO.email,
        password: signupMockDTO.password,
      };

      const tokens = await authService.signIn(signInDTO);

      expect(tokens).toBeDefined();
      expect(tokens.access_token).toBeDefined();
      expect(tokens.refresh_token).toBeDefined();
    });

    it('should throw an error if the email is not found', async () => {
      const signInDTO: SignInDto = {
        email: 'test',
        password: 'test',
      };

      try {
        await authService.signIn(signInDTO);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });
});
