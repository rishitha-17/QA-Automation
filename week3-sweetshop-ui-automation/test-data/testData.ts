export const PRODUCTS = {
  chocolateCups:  { name: 'Chocolate Cups',  price: 1.00 },
  sherbertStraws: { name: 'Sherbert Straws', price: 0.75 },
  sherbertDiscs:  { name: 'Sherbert Discs',  price: 0.95 },
  bonBons:        { name: 'Bon Bons',         price: 1.00 },
  whamBars:       { name: 'Wham Bar',         price: 0.15 },
  swanseaMixture: { name: 'Swansea Mixture',  price: 1.50 },
  nerds:          { name: 'Nerds',            price: 0.60 },
};

export const VALID_BILLING = {
  firstName: 'John',
  lastName:  'Smith',
  email:     'john.smith@example.com',
  address:   '123 High Street',
  address2:  'Flat 3',
  city:      'Bristol',
  zip:       'BS1 4DJ',
};

export const VALID_BILLING_2 = {
  firstName: 'Alice',
  lastName:  'Johnson',
  email:     'alice@test.co.uk',
  address:   '45 Park Avenue',
  address2:  '',
  city:      'Cardiff',
  zip:       'CF10 1EP',
};

export const INVALID_BILLING = {
  emailMissingAt:     'notanemail',
  emailMissingDomain: 'user@.com',
  emailMissingLocal:  '@example.com',
  emailWithSpace:     'user @example.com',
  emailSpacesOnly:    '   ',
  zipInvalid:         'INVALID',
  zipNonUK:           '00000',
};

export const EDGE_BILLING = {
  firstNameSingleChar:  'A',
  firstNameLong:        'A'.repeat(100),
  firstNameNumeric:     '12345',
  firstNameXSS:         '<script>alert(1)</script>',
  addressSpecialChars:  "12 O'Brien St, Apt #4-B",
  zipWithSpace:         'SW1A 1AA',
  zipLowercase:         'sw1a1aa',
  emailSubdomain:       'user@mail.example.co.uk',
};

export const VALID_PAYMENT = {
  cardName:   'John Smith',
  cardNumber: '4111111111111111',
  expiry:     '12/26',
  cvv:        '123',
};

export const VALID_PAYMENT_2 = {
  cardName:   'ALICE JOHNSON',
  cardNumber: '5500005555555559',
  expiry:     '06/28',
  cvv:        '456',
};

export const INVALID_PAYMENT = {
  cardNumberShort:       '4111',
  cardNumberAlpha:       'ABCDABCDABCDABCD',
  cardNumberLong:        '41111111111111112345',
  expiryPast:            '01/20',
  expiryInvalidMonth:    '13/26',
  expiryWrongFormat:     '2025/12',
  cvvTooShort:           '12',
  cvvTooLong:            '12345',
  cvvAlpha:              'ABC',
};

export const PROMO_CODES = {
  valid:         'SWEET10',
  invalid:       'INVALID99',
  empty:         '',
  validLower:    'sweet10',
  withSpaces:    ' SWEET10 ',
  specialChars:  'SW!@#$%',
  overflow:      'A'.repeat(200),
};

export const VALID_LOGIN = {
  email:    'user@sweetshop.com',
  password: 'password123',
};

export const INVALID_LOGIN = {
  emailMissingAt:  'userdomain.com',
  emailSpacesOnly: '   ',
  wrongPassword:   'wrongpassword',
};

export const SHIPPING = {
  free:     0.00,
  standard: 1.99,
};
