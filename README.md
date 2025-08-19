# 🖥️ Pixel Portfolio - Retro PC Themed Portfolio

A fully interactive portfolio website with Windows 95-style interface, live wallpapers, and retro aesthetics.

## ✨ Features

- **Retro PC Interface**: Authentic Windows 95-style desktop environment
- **Live Wallpapers**: 8 different animated wallpaper themes
- **Interactive Windows**: Draggable, resizable windows for different sections
- **Responsive Design**: Works on desktop and mobile devices
- **Sound Effects**: Authentic retro PC sounds
- **Gamification**: XP system and achievements

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Django 5.1+
- SQLite3

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pixel_portfolio
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Initialize database with sample data**
   ```bash
   python manage.py init_db
   ```

5. **Optimize database performance**
   ```bash
   python manage.py optimize_db
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Open your browser**
   Navigate to `http://127.0.0.1:8000`

## 🎮 How to Use

### Desktop Interface
- **Click icons** to open applications
- **Drag windows** by their title bars
- **Resize windows** using the bottom-right corner
- **Right-click** for context menu
- **Start button** for main menu

### Wallpapers
- **Right-click desktop** → "🎨 Change Wallpaper"
- **Start menu** → "🎨 Wallpapers"
- **Taskbar button** 🎨 for quick toggle

### Applications
- **Home**: Main portfolio overview
- **About**: Personal information and skills
- **Projects**: Showcase of work
- **Contact**: Contact form
- **My Computer**: System information
- **Notepad**: Text editor
- **Calculator**: Basic calculator
- **Recycle Bin**: Deleted items

## 🔧 Troubleshooting

### Common Issues

1. **"System initialization failed!"**
   - Check browser console for JavaScript errors
   - Ensure all static files are loaded
   - Try refreshing the page

2. **Icons not aligned**
   - Clear browser cache
   - Check CSS is loading properly
   - Verify icon positioning CSS

3. **Start menu not working**
   - Check if `toggleStartMenu` function exists
   - Verify event listeners are attached
   - Check for JavaScript errors

4. **Database errors**
   - Run `python manage.py migrate`
   - Run `python manage.py init_db`
   - Check database file permissions

### Debug Mode
Press `F12` to open the debug panel and see system status.

## 🗄️ Database Schema

### Models
- **Project**: Portfolio projects with status tracking
- **Education**: Educational background with XP bars
- **Skill**: Technical skills with proficiency levels

### Sample Data
The `init_db` command creates sample data including:
- Sample projects
- Education information
- Technical skills
- Admin user account

## 🎨 Customization

### Wallpapers
- Add new wallpaper classes in CSS
- Create corresponding JavaScript functions
- Update wallpaper grid in HTML

### Themes
- Modify CSS variables in `:root`
- Update color schemes
- Add new animation effects

### Applications
- Create new window types
- Add content to `loadWindowContent`
- Update desktop icons

## 📱 Mobile Support

- Responsive design for mobile devices
- Touch-friendly interface
- Optimized for small screens
- Mobile-specific CSS adjustments

## 🚀 Deployment

### Production Settings
1. Set `DEBUG = False`
2. Configure `ALLOWED_HOSTS`
3. Set up static file serving
4. Use production database
5. Configure security settings

### Recommended Hosting
- **Heroku**: Easy deployment with PostgreSQL
- **DigitalOcean**: VPS with full control
- **AWS**: Scalable cloud hosting
- **Vercel**: Frontend-focused hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console errors
3. Check Django server logs
4. Open an issue on GitHub

## 🔮 Future Features

- [ ] More wallpaper themes
- [ ] Additional applications
- [ ] Multi-language support
- [ ] User accounts system
- [ ] Portfolio analytics
- [ ] Export functionality
- [ ] API endpoints
- [ ] Real-time updates

---

**Built with ❤️ using Django, HTML5, CSS3, and JavaScript**
