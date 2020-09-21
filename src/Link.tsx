import { StaticLink, subscribe, getCurrentUrl } from "./Router";
import { h, Component, createRef } from "preact";

type Props = {
    activeClassName: string
    scrollToWhenActive?: boolean
} & preact.JSX.HTMLAttributes<HTMLAnchorElement>;

export class Link extends Component<Props> {
    unsubscribe?: Function;
    ref = createRef();

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }
    componentDidMount() {
        this.unsubscribe = subscribe(this.update);
    }
    update = (_: string) => {
        this.setState({});
    }
    render() {
        let classes = this.props.className || "";

        if (getCurrentUrl() === this.props.href) {
            classes += classes ? ` ${this.props.activeClassName}` : this.props.activeClassName;
            if (this.props.scrollToWhenActive) {
                this.ref.current && this.ref.current.base.scrollIntoView({inline: "end", block: "nearest"});
            }
        }

        return <StaticLink ref={this.ref} {...this.props} className={classes} />
    }
}
