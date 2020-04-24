import { StaticLink, subscribe } from "./Router";
import { h, Component } from "preact";

type Props = {activeClassName: string} & preact.JSX.HTMLAttributes<HTMLAnchorElement>;

export class Link extends Component<Props> {
    active: boolean = false;
    unsubscribe?: Function;
    constructor() {
        super();
        this.unsubscribe = subscribe(this.update);
    }
    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }
    update = (url: string) => {
        let path = url && url.replace(/\?.+$/,'');
        this.active = path === this.props.href

        this.setState({});
    }
    render() {
        let classes = this.props.className || "";
        if (this.active) {
            classes += classes ? ` ${this.props.activeClassName}` : this.props.activeClassName;
        }
        return <StaticLink {...this.props} className={classes} />
    }
}
