import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export interface RouterTools
{
    navigate: ReturnType<typeof useNavigate>;
    searchParams: ReturnType<typeof useSearchParams>[0];
    pathname: ReturnType<typeof useLocation>['pathname'];
}

export function withRouter<T>(Component: React.ComponentType<T>)
{
    return (props: Omit<T, 'routerTools'>) =>
    {
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const { pathname } = useLocation();

        const routerTools: RouterTools = {
            navigate,
            searchParams,
            pathname
        }

        return <Component {...(props as T)} routerTools={routerTools} />;
    };
}