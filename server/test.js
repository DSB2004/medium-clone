
const searchKeys = ['ART', 'MUSIC'];

// Base URL
const baseURL = 'http://localhost/api/v1/blogs/get-blogs';

// Create URLSearchParams object
const params = new URLSearchParams();
searchKeys.forEach(key => params.append('keys', key));

// Construct the full URL
const url = `${baseURL}?${params.toString()}`;

console.log(url); // Output: http://localhost/api/v1/blogs/get-blogs?searchKeys=ART&searchKeys=MUSIC

