// Mock data for demonstration purposes
// export const mockPosts = [
//   {
//     _id: '1',
//     title: 'JavaScript Fundamentals Study Notes',
//     content: 'Comprehensive notes covering JavaScript basics, ES6 features, and common patterns. Perfect for beginners and intermediate developers.',
//     category: 'notes',
//     author: {
//       _id: 'user1',
//       name: 'John Doe'
//     },
//     createdAt: '2024-01-15T10:30:00Z',
//     likes: ['user1', 'user2'],
//     comments: [
//       {
//         _id: 'comment1',
//         content: 'Great notes! Very helpful for my studies.',
//         author: {
//           _id: 'user2',
//           name: 'Jane Smith'
//         },
//         createdAt: '2024-01-15T11:00:00Z'
//       }
//     ],
//     attachments: ['https://example.com/notes1.pdf']
//   },
//   {
//     _id: '2',
//     title: 'Frontend Developer Position Available',
//     content: 'We are hiring a frontend developer with React experience. Remote work available, competitive salary. Send your resume!',
//     category: 'jobs',
//     author: {
//       _id: 'user3',
//       name: 'Tech Corp HR'
//     },
//     createdAt: '2024-01-14T09:15:00Z',
//     likes: ['user1', 'user4'],
//     comments: [
//       {
//         _id: 'comment2',
//         content: 'Is this position still open?',
//         author: {
//           _id: 'user1',
//           name: 'John Doe'
//         },
//         createdAt: '2024-01-14T10:00:00Z'
//       }
//     ],
//     attachments: []
//   },
//   {
//     _id: '3',
//     title: 'Best Practices for Student Collaboration',
//     content: 'Let\'s discuss the best ways to collaborate on group projects. Share your experiences and tips!',
//     category: 'threads',
//     author: {
//       _id: 'user2',
//       name: 'Jane Smith'
//     },
//     createdAt: '2024-01-13T14:20:00Z',
//     likes: ['user1', 'user3', 'user4'],
//     comments: [
//       {
//         _id: 'comment3',
//         content: 'I find using GitHub for version control really helps!',
//         author: {
//           _id: 'user1',
//           name: 'John Doe'
//         },
//         createdAt: '2024-01-13T15:00:00Z'
//       },
//       {
//         _id: 'comment4',
//         content: 'Regular meetings and clear communication are key.',
//         author: {
//           _id: 'user4',
//           name: 'Mike Johnson'
//         },
//         createdAt: '2024-01-13T16:30:00Z'
//       }
//     ],
//     attachments: []
//   },
//   {
//     _id: '4',
//     title: 'React Hooks Complete Guide',
//     content: 'Detailed guide covering useState, useEffect, useContext, and custom hooks. Includes practical examples and best practices.',
//     category: 'notes',
//     author: {
//       _id: 'user4',
//       name: 'Mike Johnson'
//     },
//     createdAt: '2024-01-12T16:45:00Z',
//     likes: ['user1', 'user2', 'user3'],
//     comments: [],
//     attachments: ['https://example.com/react-hooks.pdf', 'https://example.com/examples.zip']
//   },
//   {
//     _id: '5',
//     title: 'Summer Internship Opportunities',
//     content: 'Multiple internship positions available for computer science students. Paid positions with learning opportunities.',
//     category: 'jobs',
//     author: {
//       _id: 'user5',
//       name: 'Startup Inc'
//     },
//     createdAt: '2024-01-11T11:30:00Z',
//     likes: ['user1', 'user2'],
//     comments: [
//       {
//         _id: 'comment5',
//         content: 'What are the requirements for these positions?',
//         author: {
//           _id: 'user2',
//           name: 'Jane Smith'
//         },
//         createdAt: '2024-01-11T12:00:00Z'
//       }
//     ],
//     attachments: ['https://example.com/internship-details.pdf']
//   },
//   {
//     _id: '6',
//     title: 'Machine Learning Study Group',
//     content: 'Join our weekly study group to discuss machine learning concepts and projects.',
//     category: 'threads',
//     author: {
//       _id: 'user6',
//       name: 'Sara Lee'
//     },
//     createdAt: '2024-01-10T10:00:00Z',
//     likes: ['user2', 'user3'],
//     comments: [],
//     attachments: []
//   },
//   {
//     _id: '7',
//     title: 'Scholarship Alert: Apply Now!',
//     content: 'New scholarships available for STEM students. Check eligibility and apply soon.',
//     category: 'jobs',
//     author: {
//       _id: 'user7',
//       name: 'Scholarship Board'
//     },
//     createdAt: '2024-01-09T09:00:00Z',
//     likes: ['user1'],
//     comments: [],
//     attachments: []
//   },
//   {
//     _id: '8',
//     title: 'Share Your Favorite Coding Resources',
//     content: 'Let us know your go-to websites, books, or videos for learning programming.',
//     category: 'threads',
//     author: {
//       _id: 'user8',
//       name: 'Alex Kim'
//     },
//     createdAt: '2024-01-08T08:00:00Z',
//     likes: [],
//     comments: [],
//     attachments: []
//   },
//   {
//     _id: '9',
//     title: 'Exam Tips & Tricks',
//     content: 'Share your best tips for preparing and succeeding in exams.',
//     category: 'notes',
//     author: {
//       _id: 'user9',
//       name: 'Priya Patel'
//     },
//     createdAt: '2024-01-07T07:00:00Z',
//     likes: ['user3'],
//     comments: [],
//     attachments: []
//   },
//   {
//     _id: 'demo-1',
//     title: 'Group Project: Final Report Template',
//     content: 'Here is the template for our final report. Please review and let me know if you have suggestions. @Jane Smith and @Alex Kim, you are tagged for feedback.',
//     category: 'notes',
//     author: {
//       _id: 'user1',
//       name: 'John Doe'
//     },
//     createdAt: '2024-07-07T10:00:00Z',
//     likes: ['user2', 'user3'],
//     comments: [],
//     attachments: ['https://example.com/final-report-template.pdf'],
//     tags: [
//       { _id: 'user2', name: 'Jane Smith' },
//       { _id: 'user8', name: 'Alex Kim' }
//     ]
//   },
//   {
//     _id: 'demo-job-1',
//     title: 'Frontend Developer Referral at Tech Corp',
//     content: 'Tech Corp is hiring a frontend developer! Use my referral link to apply. @Jane Smith and @Alex Kim, let me know if you need a referral.',
//     category: 'jobs',
//     author: {
//       _id: 'user2',
//       name: 'Jane Smith'
//     },
//     createdAt: '2024-07-08T09:00:00Z',
//     likes: ['user1', 'user3'],
//     comments: [],
//     attachments: ['https://example.com/job-description.pdf'],
//     tags: [
//       { _id: 'user1', name: 'John Doe' },
//       { _id: 'user8', name: 'Alex Kim' }
//     ],
//     link: 'https://careers.techcorp.com/frontend-referral'
//   }
// ];

export const mockUser = {
  _id: 'user1',
  name: 'John Doe',
  email: 'demo@example.com'
};

export const mockUsers = [
  { _id: 'user1', name: 'John Doe' },
  { _id: 'user2', name: 'Jane Smith' },
  { _id: 'user3', name: 'Tech Corp HR' },
  { _id: 'user4', name: 'Mike Johnson' },
  { _id: 'user5', name: 'Startup Inc' },
  { _id: 'user6', name: 'Sara Lee' },
  { _id: 'user7', name: 'Scholarship Board' },
  { _id: 'user8', name: 'Alex Kim' },
  { _id: 'user9', name: 'Priya Patel' },
]; 