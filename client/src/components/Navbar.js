import { Navbar, Container, Nav, Button } from 'react-bootstrap'; // Добавляем Button в импорт
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MainNavbar() {
 const [isAuth, setIsAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuth(false);
        setAuthChecked(true);
        return;
      }

      try {
        const res = await fetch('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log('Текущий пользователь:', data.user);
          setIsAuth(true);
        } else {
          // Токен неверен или просрочен
          localStorage.removeItem('token');
          setIsAuth(false);
        }
      } catch (err) {
        console.error('Ошибка при проверке авторизации:', err);
        setIsAuth(false);
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) return null; // Пока не проверили — не рендерим
  
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