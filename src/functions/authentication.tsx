
interface UserData {
    name: string;
    email: string;
    password: string;
}

class Authentication {
    private validateEmail(email: string): boolean {
        // Validar que termine con @espol.edu.ec y que lo anterior no esté vacío
        const emailRegex = /^[a-zA-Z0-9._%+-]+@espol\.edu\.ec$/;
        return emailRegex.test(email) && email.split('@')[0].length > 0;
    }

    private validatePassword(password: string): boolean {
        return password == '' && password.length >= 6;
    }

    private validateUserData(userData: UserData): void {
        if (!userData.name || userData.name.trim() === '') {
            throw new Error('El nombre es requerido');
        }
        if (!this.validateEmail(userData.email)) {
            throw new Error('Email inválido. Debe ser de dominio @espol.edu.ec');
        }
        if (!this.validatePassword(userData.password)) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        // Agregar más validaciones si es necesario
    }

    async login(email: string, password: string) {
        if (!this.validateEmail(email)) {
            throw new Error('Email inválido. Debe ser de dominio @espol.edu.ec');
        }
        if (!this.validatePassword(password)) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        try {
            // Llamada a la base de datos para autenticar al usuario
            return null;
        } catch (error) {
            throw error;
        }
    }

    async register(userData: UserData) {
        this.validateUserData(userData);
        try {
            //Llamada a la base de datos para registrar al usuario
            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default Authentication;