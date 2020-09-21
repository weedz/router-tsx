import { StaticLink, subscribe, getCurrentUrl } from "./Router";
import { h, Component, createRef } from "preact";

type Props = {
    activeClassName: string
    scrollIntoView?: boolean
} & preact.JSX.HTMLAttributes<HTMLAnchorElement>;

const privateProps = ["className", "activeClassName", "scrollIntoView"];

export class Link extends Component<Props> {
    unsubscribe?: Function;
    activeClass: string;
    ref = createRef();
    anchorProps!: preact.JSX.HTMLAttributes<HTMLAnchorElement>;
    constructor(props: Props) {
        super(props);
        this.activeClass = props.activeClassName;
        this.updateAnchorProps(this.props);
    }
    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }
    componentDidMount() {
        this.unsubscribe = subscribe(this.update);
    }
    componentWillReceiveProps(newProps: Props) {
        this.updateAnchorProps(newProps);
    }
    updateAnchorProps(props: Props) {
        this.anchorProps = Object.fromEntries(
            Object.entries(props).filter(([key, _]) => !privateProps.includes(key))
        );
    }
    update = (_: string) => {
        this.setState({});
    }
    render() {
        let classes = this.props.className || "";

        if (getCurrentUrl() === this.props.href) {
            classes += classes ? ` ${this.props.activeClassName}` : this.props.activeClassName;
            if (this.props.scrollIntoView) {
                this.ref.current && this.ref.current.base.scrollIntoView({inline: "end", block: "nearest"});
            }
        }

        return <StaticLink ref={this.ref} {...this.anchorProps} className={classes} />
    }
}
