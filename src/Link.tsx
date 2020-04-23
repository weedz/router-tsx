import { StaticLink, getCurrentUrl } from "./Router";
import { h } from "preact";

export function Link(props: {activeClassName?: string} & preact.JSX.HTMLAttributes<HTMLAnchorElement>) {
    let url = getCurrentUrl();
    let path = url && url.replace(/\?.+$/,'');
    const classes = props.className ? [props.className] : [];
    if (props.activeClassName) {
        if (path === props.href) {
            classes.push(props.activeClassName);
        }
        delete props.activeClassName;
    }
    return <StaticLink {...props} className={classes.join(" ")} />
}
