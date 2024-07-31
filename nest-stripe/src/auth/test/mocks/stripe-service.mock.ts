export const stripeServiceMock = {
  createCustomerOnStripe: jest.fn().mockResolvedValue({
    id: 'cus_mocked_id',
    email: 'johndoe@test.com',
    address: {
      city: "Santa Bárbara d'Oeste",
      country: 'Brazil',
      line1: 'Rua Jales, 99',
      line2: '',
      postal_code: '13454-040',
      state: 'SP',
    },
    metadata: {
      cpfCnpj: '99535364065',
      name: 'John Doe',
      phone: '6899583-3648',
    },
  }),
  deleteCustomerFromStripe: jest.fn().mockResolvedValue({}),
};
