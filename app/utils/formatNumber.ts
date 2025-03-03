export const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    } else if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return num.toString();
};

export type IGGender = 'M' | 'F' | 'U'

export const formatGender = (gender: IGGender) => {
    switch (gender) {
        case 'M':
            return 'Male'
        case 'F':
            return 'Female'
        case 'M':
        case 'U':
            return 'Unisex'
        default:
            break;
    }
}


// Input: khoilam_2342asdf
// Output: khoilam
export function formatName(input: string) {
    // Remove the part after the underscore
    let name = input?.split('_')[0];

    // Capitalize each word while keeping accents
    return name
        ?.split(' ')
        ?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase())
        ?.join(' ');
}


// Example usage
// const url = "https://abc.jpg";
// console.log(checkMediaType(url)); // Output: 'image'

export function abbreviateLastName(name: string, maxLength: number): string {
    if(!name) return ''
    const parts = name?.trim()?.split(" ");
    const abbreviatedName = parts?.length > 2 
        ? `${parts?.slice(0, -1)?.join(" ")} ${parts?.at(-1)?.[0] || ''}...`
        : name;
    
    return abbreviatedName.length > maxLength
        ? `${abbreviatedName?.slice(0, maxLength - 3)}...`
        : abbreviatedName;
}

// Example usage
// console.log(abbreviateLastName("cathy pieerse land", 20)); 
// Output: "cathy pieerse l..."
