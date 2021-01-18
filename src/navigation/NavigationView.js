const PageNotFound = ({page}) => <h1>{`Page '${page}' not found`}</h1>

const NavigationView = ({page, Profile}) => {
    const pageMap = {
        profile: Profile
    }
    const Component = pageMap[page] || PageNotFound
    return <div className={'Navigation'}>
        <Component/>
    </div>
}

export default NavigationView;
