const dynamic = async moduleName => {
    const Module = await import(moduleName);
    return Module;
}