// document.addEventListener('DOMContentLoaded', function () {
//     // Links das redes sociais
//     const instagramLink = document.querySelector('.instagram-button');
//     const linkedinLink = document.querySelector('.linkedin-button');

//     if (instagramLink) {
//         instagramLink.addEventListener('click', function(e) {
//             e.preventDefault();
//             window.open('https://www.instagram.com/leticiacreates', '_blank');
//         });
//     }

//     if (linkedinLink) {
//         linkedinLink.addEventListener('click', function(e) {
//             e.preventDefault();
//             window.open('https://www.linkedin.com/in/leticia-m-lopes', '_blank');
//         });
//     }

//     // Floating CTA
//     const floatingCta = document.getElementById('floating-cta');

//     if (floatingCta) {
//         window.addEventListener('scroll', function () {
//             if (window.scrollY > 500) {
//                 floatingCta.style.display = 'block';
//             } else {
//                 floatingCta.style.display = 'none';
//             }
//         });
//     }

//     // CTA Buttons
//     const ctaButtons = document.querySelectorAll('.cta-button, .secondary-button');

//     ctaButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             alert('Obrigado pelo seu interesse! Em breve você receberá mais informações.');
//         });
//     });

//     // Mobile menu
//     const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
//     const menuLinks = document.querySelector('.menu-links');

//     if (mobileMenuIcon && menuLinks) {
//         mobileMenuIcon.addEventListener('click', function () {
//             menuLinks.classList.toggle('active');
//         });

//         const links = document.querySelectorAll('.menu-links a');
//         links.forEach(link => {
//             link.addEventListener('click', function () {
//                 if (window.innerWidth <= 768) {
//                     menuLinks.classList.remove('active');
//                 }
//             });
//         });
//     }
// });
