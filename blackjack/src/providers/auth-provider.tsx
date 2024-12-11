import { useEffect, useState, ComponentType } from 'react';
import { useNavigate } from 'react-router';
import Loading from '../components/loading';

// Props tipi için generic bir interface
interface WithAuthProps {
    // Eğer wrapped component'e özel proplar varsa buraya eklenebilir
}

function AuthProvider<P extends WithAuthProps>(WrappedComponent: ComponentType<P>) {
    const Wrapper = (props: P) => {
        const [loading, setLoading] = useState(true);
        const [accessDenied, setAccessDenied] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            const verifyAuthToken = async () => {
                try {
                    const res = await fetch("http://localhost:1234/api/auth/verify", {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (res.status === 200) {
                        setLoading(false);
                        setAccessDenied(false);
                    } else {
                        setLoading(false);
                        setAccessDenied(true);
                    }
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    setLoading(false);
                    setAccessDenied(true);
                }
            };
            verifyAuthToken();
        }, []);

        useEffect(() => {
            if (accessDenied && !loading) {
                navigate('/');
            }
        }, [accessDenied, loading, navigate]);

        if (loading) {
            return <Loading />;
        }

        if (accessDenied) {
            return null; // Navigate effect will handle the redirect
        }

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
}

export default AuthProvider;