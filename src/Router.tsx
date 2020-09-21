import { Router } from "@weedzcokie/router";
import { h, Component, VNode, cloneElement } from "preact";

export type SubscriberCallback = (url: string) => void;
type RouteComponent = VNode<RoutableProps>;

let currentUrl = "";
let routers: RouterComponent[] = [];
let subscribers: SubscriberCallback[] = [];

export function subscribe(cb: SubscriberCallback) {
    subscribers.push(cb);
    return () => {
        subscribers.splice(subscribers.indexOf(cb)>>>0, 1);
    };
}

export type RoutableProps<T = {}> = T & {
    path: string;
    default?: boolean;
};

export interface RouterProps {
    url?: string;
    children: RouteComponent[];
}

interface RouterState {
    active?: RouteComponent;
    props?: any;
    url: string;
}

export class RouterComponent extends Component<RouterProps, RouterState> {
    router: Router<RouteComponent>;
    constructor(props: RouterProps) {
        super(props);
        this.router = new Router();
        for (const child of props.children) {
            const route = this.router.set("GET", child.props.path, child);
        }
    }
    componentWillMount() {
        routers.push(this);
    }
    componentDidMount() {
        this.props.url && routeTo(this.props.url);
    }
    componentWillUnmount() {
        routers.splice(routers.indexOf(this)>>>0, 1);
    }
    getRoute(url: string) {
        return this.router.find(url, "GET");
    }
    setRoute(url: string) {
        if (url != this.state.url) {
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
    }
    render() {

        if (this.state.active) {
            return cloneElement(this.state.active, Object.assign({url: this.state.url}, this.state.props));
        }
    }
}

export function routeTo(url: string = "/") {
    currentUrl = url.replace(/\?.+$/, "");
    for (const route of routers) {
        route.setRoute(currentUrl);
    }
    for (const listener of subscribers) {
        listener(currentUrl);
    }
}
function routeFromLink(e: HTMLAnchorElement) {
    const href = e.getAttribute("href");
    href && routeTo(href);
}
export function getCurrentUrl() {
    return currentUrl;
}

function handleLinkClick(e: MouseEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button!==0) return;
    e.preventDefault();
    e.currentTarget && routeFromLink(e.currentTarget as unknown as HTMLAnchorElement);
    return false;
}
export function StaticLink(props: preact.JSX.HTMLAttributes<HTMLAnchorElement>) {
    return <a {...props} onClick={handleLinkClick} />;
}
