import { Navbar, Container, Nav, Button } from 'react-bootstrap'; // Добавляем Button в импорт
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MainNavbar() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  // Следим за изменениями в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false); // Обновляем состояние
    window.location.href = '/login'; // Полная перезагрузка страницы
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">Team Chat</Navbar.Brand>
        <Nav className="ms-auto">
          {isAuth ? (
            // Показываем если пользователь авторизован
            <>
              <Nav.Link as={Link} to="/home">Профиль</Nav.Link>
              <Button 
                variant="outline-danger" 
                onClick={handleLogout}
                className="ms-2" // Добавляем отступ слева
              >
                Выйти
              </Button>
            </>
          ) : (
            // Показываем если не авторизован
            <>
              <Nav.Link as={Link} to="/login">Вход</Nav.Link>
              <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}