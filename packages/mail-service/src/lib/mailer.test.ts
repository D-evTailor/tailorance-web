import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { sendEmail } from './mailer';
// Importamos los tipos para usarlos en nuestros mocks
import { EmailParams, Sender, Recipient } from 'mailersend';

// No necesitamos mockear toda la librería, solo las clases que instanciamos.
jest.mock('mailersend', () => ({
    // Mockeamos solo lo que necesitamos para que el SUT (System Under Test) no falle.
    __esModule: true, // Necesario para que el mock funcione con ES Modules
    MailerSend: class {}, // Un mock vacío para la clase principal que no usamos
    EmailParams: jest.fn(() => ({
        setFrom: jest.fn().mockReturnThis(),
        setTo: jest.fn().mockReturnThis(),
        setSubject: jest.fn().mockReturnThis(),
        setHtml: jest.fn().mockReturnThis(),
    })),
    Sender: jest.fn(),
    Recipient: jest.fn(),
}));


describe('Mailer Service with Dependency Injection', () => {
    // Creamos un mock del cliente con una función de envío mockeada y tipada
    const mockSendFunction = jest.fn<() => Promise<{ headers: { 'x-message-id': string } }>>();
    const mockClient = {
        email: {
            send: mockSendFunction,
        },
    };

    beforeEach(() => {
        // Limpiamos todos los mocks antes de cada test
        jest.clearAllMocks();
        // Restauramos la implementación del mock si la hemos cambiado
        mockSendFunction.mockReset();

        // Configuramos las variables de entorno para el test
        process.env.MAILERSEND_SENDER_EMAIL = 'test-sender@example.com';
        process.env.MAILERSEND_SENDER_NAME = 'Test Sender Name';
    });

    it('should call the injected mailer client with correct parameters', async () => {
        // Arrange: Preparamos la respuesta del mock
        mockSendFunction.mockResolvedValue({ headers: { 'x-message-id': 'mock-id' } });

        // Act: Ejecutamos la función a probar, inyectando nuestro cliente mockeado
        await sendEmail('recipient@example.com', 'Test Subject', '<p>Test HTML</p>', mockClient as any);

        // Assert: Verificamos que todo se llamó como se esperaba
        expect(mockSendFunction).toHaveBeenCalledTimes(1);

        // Verificamos que las clases de MailerSend se instanciaron correctamente
        expect(Sender).toHaveBeenCalledWith('test-sender@example.com', 'Test Sender Name');
        expect(Recipient).toHaveBeenCalledWith('recipient@example.com');
        
        // Verificamos que el objeto de parámetros se construyó
        expect(EmailParams).toHaveBeenCalledTimes(1);
        const emailParamsInstance = (EmailParams as jest.Mock).mock.results[0].value as { setSubject: jest.Mock, setHtml: jest.Mock };
        expect(emailParamsInstance.setSubject).toHaveBeenCalledWith('Test Subject');
        expect(emailParamsInstance.setHtml).toHaveBeenCalledWith('<p>Test HTML</p>');
    });

    it('should throw an error if the injected client fails', async () => {
        // Arrange: Configuramos el mock para que falle
        const errorMessage = 'Client Network Error';
        mockSendFunction.mockRejectedValue(new Error(errorMessage));

        // Act & Assert: Verificamos que la función arroja la excepción esperada
        await expect(sendEmail('fail@example.com', 'subject', 'html', mockClient as any))
            .rejects.toThrow(errorMessage);
    });
});
 