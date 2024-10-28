document.addEventListener('DOMContentLoaded', () => {
    const skeletonContainer = document.querySelector('.content__Shop')
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < 20; i++) {
        const skeletonElement = document.createElement('div')
        skeletonElement.className =
            'wrapper__Product-placeholder skeleton-animation'
        fragment.appendChild(skeletonElement)
    }

    skeletonContainer.appendChild(fragment)
})
