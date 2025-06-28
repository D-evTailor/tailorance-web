export const mockSend = jest.fn();

export const MailerSend = jest.fn().mockImplementation(() => {
  return {
    email: {
      send: mockSend,
    },
  };
});

// Mock other named exports if they are used in the code under test
export const EmailParams = jest.fn().mockImplementation(() => ({
  setFrom: jest.fn().mockReturnThis(),
  setTo: jest.fn().mockReturnThis(),
  setSubject: jest.fn().mockReturnThis(),
  setHtml: jest.fn().mockReturnThis(),
  setText: jest.fn().mockReturnThis(),
}));
export const Sender = jest.fn();
export const Recipient = jest.fn();
