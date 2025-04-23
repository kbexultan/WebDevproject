import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  projectInfo = 'Welcome to our comprehensive online bookstore! We offer a vast selection of books spanning various genres, catering to every reader\'s taste. Our platform is designed to provide a seamless and enjoyable book discovery and purchasing experience.';
  creatorsInfo = 'Meet the dedicated individuals who brought this project to life:';
  creators = [
    {
      name: 'Zhiger Dinmukhamed',
      contribution: 'Led the front-end development of this bookstore, designing and implementing a user-friendly interface that ensures a smooth experience for customers. Zhiga focused on building intuitive layouts, handling user interactions, and integrating the UI with the back-end APIs.'
    },
    {
      name: 'Kalabay Bexultan',
      contribution: 'Focused on the crucial back-end development of the bookstore. Bex played a key role in building the server-side logic, database management, and API endpoints that power the application, ensuring its stability and efficiency.'
    },
    {
      name: 'Kopbergen Ashirali-Dulat',
      contribution: 'Duks supported both front-end and back-end development, contributing to the overall system architecture and ensuring seamless integration between the client and server. Alex helped design and implement key back-end features, managed database interactions, and supported the front-end with reusable components and API connectivity.'
    }
  ];
  websiteFeatures = [
    'Browse and search through an extensive catalog of books.',
    'View detailed information about each book, including descriptions and reviews.',
    'Easily add books to your shopping cart and manage your selections.',
    'Secure user registration and login for a personalized experience.',
    'A streamlined checkout process for hassle-free purchases.',
    'Responsive design ensuring a great experience on all devices.'
  ];
}