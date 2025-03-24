import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export function withRouter<T>(Component: React.ComponentType<T>)
{
    return (props: Omit<T, 'navigate' | 'searchParams' | 'pathname'>) =>
    {
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const { pathname } = useLocation();
        return <Component {...(props as T)} navigate={navigate} searchParams={searchParams} pathname={pathname} />;
    };
}