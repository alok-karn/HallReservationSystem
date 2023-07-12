function validateEmail(email) {
    const regex = [
        /^bl\.en\.u4(cse|aie|mee|eee|eac|ece)(19|20|[2-9][1-9]|)\d{3}@bl\.students\.amrita\.edu$/,
        /^[a-zA-Z0-9]+[-_.]?[a-zA-Z0-9]+@blr\.amrita\.edu$/,
    ];

    return regex.some((reg) => reg.test(email));
}

const validEmail = [
    "bl.en.u4cse20012@bl.students.amrita.edu",
    "bl.en.u4eac22035@bl.students.amrita.edu",
    "bl.en.u4mee19035@bl.students.amrita.edu",
    "rg_chittawadigi@blr.amrita.edu",
];

const invalidEmail = [
    "al.bc.u5cse21012@bl.students.amrita.edu",
    "blenu4cse17045@bl.students.amrita.edu",
    "blenu4eie15053@bl.students.amrita.edu",
    "alokkyasth@gmail.com",
];

validEmail.forEach((email) => {
    console.log(`${email} is valid: ${validateEmail(email)}`);
});
console.log("\n");

invalidEmail.forEach((email) => {
    console.log(`${email} is valid: ${validateEmail(email)}`);
});
