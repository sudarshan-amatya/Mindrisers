let courses = [
    {
        name: "mern",
        price: 24000
    },
    {
        name: "python",
        price: 15000
    },
    {
        name: "Ui/Ux",
        price: 14000
    },
]

// for (const course of courses) {
//     for (const key in course) {
//         console.log(key+":"+course[key]);
//     }
// }
for (const course of courses) {
    console.log(`Course: ${course.name} , Price: rs ${course.price}`);
}

