const showMenu = (menu) => {
    const menuMap = {};
    const menuTree = [];

    menu.forEach((m) => {
        menuMap[m._id] = {
            ...m,
            subMenu: [],
            isParent: true,
        };
    });

    menu.forEach((m) => {
        if (m.parent) {
            const parent = menuMap[m.parent._id] || menuMap[m.parent]; // if populate and if not bc its undefined

            if (parent) {

                parent.subMenu.push(menuMap[m._id]);
                menuMap[m._id].isParent = false;
            }
        } else {
            menuTree.push(menuMap[m._id]);
        }
    });

    return menuTree;
};


module.exports = showMenu;


// array = ['a', 'b', 'c', 'd'];
// for (let i = 0; i < array.length; i++) {
//     if (array[i] === 'b') {
//         array.splice(i, 1);
//         i--;
//                 i = 1
//          ['a', 'b', 'c', 'd'] 
//
//                 i = 2 now we should i-- to check c
//          ['a', 'c', 'd']
//     }
// }