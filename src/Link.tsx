import { StaticLink, subscribe, getCurrentUrl } from "./Router";
import { h, Component } from "preact";

type Props = {activeClassName: string} & preact.JSX.HTMLAttributes<HTMLAnchorElement>;

export class Link extends Component<Props> {
    unsubscribe?: Function;
    activeClass: string;
    constructor(props: Props) {
        super(props);
        this.unsubscribe = subscribe(this.update);
        this.activeClass = props.activeClassName;
        delete props.activeClassName;
    }
    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }
    update = (_: string) => {
        this.setState({});
    }
    render(props: Props) {
        let classes = this.props.className || "";

        let path = getCurrentUrl().replace(/\?.+$/, "");

        if (path === this.props.href) {
            classes += classes ? ` ${this.activeClass}` : this.activeClass;
        }
        return <StaticLink {...props} className={classes} />
    }
}
