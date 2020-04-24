import { StaticLink, subscribe } from "./Router";
import { h, Component } from "preact";

type Props = {activeClassName: string} & preact.JSX.HTMLAttributes<HTMLAnchorElement>;

export class Link extends Component<Props, {active: boolean}> {
    unsubscribe?: Function;
    activeClass: string;
    constructor(props: Props) {
        super(props);
        this.unsubscribe = subscribe(this.update);
        this.activeClass = props.activeClassName;
        delete props.activeClassName;
        this.state = {
            active: false
        };
    }
    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }
    update = (url: string) => {
        let path = url && url.replace(/\?.+$/,'');
        const newState = path === this.props.href;

        if (this.state.active !== newState) {
            this.setState({active: newState});
        }
    }
    render(props: Props) {
        let classes = this.props.className || "";
        if (this.state.active) {
            classes += classes ? ` ${this.activeClass}` : this.activeClass;
        }
        return <StaticLink {...props} className={classes} />
    }
}
