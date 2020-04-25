import { Router } from "router";
import { h, Component, VNode, cloneElement, createElement } from "preact";

let currentUrl = "";
let routers: RouterComponent[] = [];
let subscribers: Function[] = [];

export function subscribe(cb: Function) {
    subscribers.push(cb);
    return () => {
        subscribers.splice(subscribers.indexOf(cb)>>>0, 1);
    };
}

export type RoutableProps<T = {}> = T | T & {
    path?: string;
    default?: boolean;
};

export interface RouterProps {
    url?: string;
    // TODO: this should just be VNode<RoutableProps>[] but TypeScript can't infer
    // that type when typechecking against Component props. Using any as a workaround..
    children: VNode<RoutableProps>[] | any[] // must not render Router with an empty list of children
}

interface RouterState {
    active?: VNode<RoutableProps>;
    props: any;
    default: VNode<RoutableProps>;
    url?: string;
}

export class RouterComponent extends Component<RouterProps, RouterState> {
    router: Router;
    constructor(props: RouterProps) {
        super(props);
        routers.push(this);
        this.router = new Router();
        let defaultChild;
        for (const child of this.props.children) {
            const route = this.router.set("GET", child.props.path || "/", child);
            if (child.props.default) {
                defaultChild = route.callback;
            }
        }

        if (this.props.url && !currentUrl) {
            currentUrl = this.props.url
        }

        this.state = {
            active: defaultChild,
            default: defaultChild,
            props: {},
        };
    }
    componentDidMount() {
        routeTo(currentUrl);
    }
    componentWillUnmount() {
        routers.splice(routers.indexOf(this)>>>0, 1)
    }
    setRoute(url: string) {
        const route = this.router.find(url, "GET");
        if (route) {
            this.setState({
                url,
                active: route.callback,
                props: route.params,
            });
            return true;
        } else {
            // TODO: render default??
            return false;
        }
    }
    render() {
        const current = this.state.active || this.state.default;
        
        if (current) {
            return cloneElement(current, Object.assign({}, this.state.props, {url: this.state.url}));
        }
    }
}

export function routeTo(url: string) {
    for (const route of routers) {
        if (route.setRoute(url)) {
            currentUrl = url;
            break;
        }
    }
    for (const listener of subscribers) {
        listener(url);
    }
}
function routeFromLink(e: HTMLAnchorElement) {
    if (!e) {
        return;
    }
    routeTo(e.pathname);
}
export function getCurrentUrl() {
    return currentUrl;
}

// Shit out of luck for event types...
function handleLinkClick(e: any) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button!==0) return;
    e.currentTarget && routeFromLink(e.currentTarget);
    e.preventDefault();
    return false;
}
export function StaticLink(props: preact.JSX.HTMLAttributes<HTMLAnchorElement>) {
    return createElement("a", Object.assign({ onClick: handleLinkClick}, props));
}
