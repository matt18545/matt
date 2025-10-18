import React from 'react';

interface LoginViewProps {
    onLogin: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#FBBC05" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#EA4335" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.251 45 30.631 45 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);


const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div className="dashboard-card p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Portefeuille Pro
                    </h1>
                    <p className="mt-4 text-gray-300">
                        Connectez-vous pour synchroniser vos données de manière sécurisée et y accéder depuis n'importe quel appareil.
                    </p>
                    <div className="mt-8">
                         <button
                            onClick={onLogin}
                            className="btn-glass bg-white/90 border-transparent text-gray-800 w-full hover:bg-white text-base py-3"
                        >
                            <GoogleIcon />
                            Se connecter avec Google
                        </button>
                    </div>
                     <p className="mt-6 text-xs text-gray-500">
                        En vous connectant, vous autorisez l'application à créer un fichier de données dans un dossier privé de votre Google Drive.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
