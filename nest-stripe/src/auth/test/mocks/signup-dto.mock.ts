import { SignUpDto } from 'src/auth/dto/sign-up.dto';

export const signupMockDTO: SignUpDto = {
  name: 'John Doe',
  email: 'johndoe@test.com',
  cpfCnpj: '99535364065',
  phone: '6899583-3648',
  password: 'Teste123@',
  address: {
    city: "Santa Bárbara d'Oeste",
    line1: 'Rua Jales, 99',
    line2: '',
    country: 'Brazil',
    postal_code: '13454-040',
    state: 'SP',
  },
};
