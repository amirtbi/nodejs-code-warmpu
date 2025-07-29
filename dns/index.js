import dns from "dns";


const findDns = async (domainName) => {
    const result = dns.lookup(domainName, (err, add, family) => {
        console.log("family", family)
    });

    // const resolveText = await dns.resolveMx(domainName);
    console.log("Resolve", result)
}

findDns("rayanhamafza.com")