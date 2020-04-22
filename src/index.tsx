import { Router } from "router";
import { h, Component, VNode, cloneElement } from "preact";

let routers: RouterComponent[] = [];

export interface RoutableProps {
    path?: string;
    default?: boolean;
}

export interface RouterProps extends RoutableProps {
    static?: boolean;
    url?: string;
    // TODO: this should just be VNode<RoutableProps>[] but TypeScript can't infer
    // that type when typechecking against Component props. Using any as a workaround..
    children: VNode<RoutableProps>[] | any[] // must not render Router with an empty list of children
}

export class RouterComponent extends Component<RouterProps, {active?: VNode<RoutableProps>, props?: any, default: VNode<RoutableProps>}> {
    router: Router;
    constructor(props: RouterProps) {
        super(props);
        if (!Array.isArray(this.props.children) || !this.props.children.length) {
            throw Error("RouterComponent must have atleast one child");
        }
        routers.push(this);
        this.router = new Router();
        let defaultChild;
        for (const child of this.props.children) {
            this.router.set("GET", child.props.path || "/", child);
            if (child.props.default) {
                defaultChild = child;
            }
        }

        this.state = {
            default: defaultChild
        };
    }
    componentWillUnmount() {
        routers = routers.filter(router => router !== this);
    }
    setRoute(uri: string) {
        const route = this.router.find(uri, "GET");
        if (route) {
            this.setState({
                active: route.callback,
                props: route.params,
            });
            return true;
        } else {
            return false;
        }
    }
    render() {
        const current: VNode<RoutableProps> = this.state.active || this.state.default;
        
        if (current) {
            return cloneElement(current, this.state.props);
        }
    }
}

function routeFromLink(e: HTMLAnchorElement) {
    if (!e) {
        return;
    }
    for (const route of routers) {
        if (route.setRoute(e.pathname)) {
            break;
        }
    }
}
// Shit out of luck for event types...
function handleLinkClick(e: any) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button!==0) return;
    e.currentTarget && routeFromLink(e.currentTarget);
    e.preventDefault();
    return false;
}
export function Link(props: {activeClassName?: string} & preact.JSX.HTMLAttributes<HTMLAnchorElement>) {
    return <a onClick={handleLinkClick} {...props}>{props.children}</a>
}
