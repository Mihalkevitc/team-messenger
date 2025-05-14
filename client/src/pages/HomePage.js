import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup, Badge, Tab, Tabs } from 'react-bootstrap';
import { Search, PlusCircle, PeopleFill, ChatLeftText, Translate } from 'react-bootstrap-icons';

export default function HomePage() {
  const [items, setItems] = useState([]); // Объединённый список чатов и команд
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' или 'teams'
  const [containerHeight, setContainerHeight] = useState('90vh'); // Высота с учётом навбара

  // Загрузка данных при монтировании и смене вкладки
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = activeTab === 'chats' ? '/api/chats' : '/api/teams';
        const response = await axios.get(`http://localhost:5000${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setItems(response.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    
    fetchData();
  }, [activeTab]);

  // Фильтрация элементов по поисковому запросу
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Рассчитываем высоту после монтирования компонента
  useEffect(() => {
    const navbarHeight = document.querySelector('nav')?.offsetHeight || 60;
    setContainerHeight(`calc(100vh - ${navbarHeight}px)`);
  }, []);

  return (
    <Container fluid className="p-0" style={{ height: containerHeight }}>
      <Row className="g-0 h-100">
        {/* Левая колонка - список чатов/команд */}
        <Col md={4} className="border-end h-100 d-flex flex-column">
          {/* Вкладки чатов/команд */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="px-3 pt-2"
          >
            <Tab eventKey="chats" title={<><ChatLeftText className="me-1" /> Чаты</>} />
            <Tab eventKey="teams" title={<><PeopleFill className="me-1" /> Команды</>} />
          </Tabs>

          {/* Панель управления */}
          <div className="p-3 border-bottom">
            <div className="d-flex align-items-center">
              <Form.Control
                type="search"
                placeholder={`Поиск ${activeTab === 'chats' ? 'чатов' : 'команд'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="me-2"
              />
              <Button 
                variant="outline-primary" 
                className="rounded-circle p-1" // Добавляем p-1 для уменьшения внутренних отступов
                title={activeTab === 'chats' ? 'Создать чат' : 'Создать команду'}
                style={{ width: '37px', height: '38px' }} // Фиксируем размер
              >
                <PlusCircle size={27}/> {/* Уменьшаем размер иконки */}
              </Button>
            </div>
          </div>
          
          {/* Прокручиваемый список элементов */}
          <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
            {filteredItems.map(item => (
              <ListGroup.Item 
                key={item.id}
                action 
                active={activeItem?.id === item.id}
                onClick={() => setActiveItem(item)}
                className="d-flex justify-content-between align-items-start"
              >
                <div>
                  <strong>{item.name}</strong>
                  <div className="text-muted small">
                    {activeTab === 'chats' 
                      ? (item.lastMessage?.text || 'Нет сообщений')
                      : (item.description || 'Нет описания')}
                  </div>
                </div>
                {activeTab === 'chats' && item.unreadCount > 0 && (
                  <Badge bg="primary" pill>{item.unreadCount}</Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Правая колонка - рабочая область */}
        <Col md={8} className="h-100 d-flex flex-column">
          {activeItem ? (
            <>
              {/* Шапка рабочей области */}
              <div className="p-3 border-bottom">
                <h4>
                  {activeTab === 'chats' ? (
                    <ChatLeftText className="me-2" />
                  ) : (
                    <PeopleFill className="me-2" />
                  )}
                  {activeItem.name}
                </h4>
              </div>
              
              {/* Основное содержимое с прокруткой */}
              <div className="flex-grow-1 overflow-auto p-3">
                {activeTab === 'chats' ? (
                  // Отображение чата
                  activeItem.messages?.map(message => (
                    <div key={message.id} className="mb-3">
                      <div className="d-flex">
                        <strong className="me-2">{message.sender.name}:</strong>
                        <span>{message.text}</span>
                      </div>
                      <small className="text-muted">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </small>
                    </div>
                  ))
                ) : (
                  // Отображение информации о команде
                  <div>
                    <h5>Описание</h5>
                    <p>{activeItem.description || 'Нет описания'}</p>
                    
                    <h5 className="mt-4">Участники</h5>
                    <ListGroup>
                      {activeItem.members?.map(member => (
                        <ListGroup.Item key={member.user.id}>
                          {member.user.name} 
                          {member.role && (
                            <Badge bg="secondary" className="ms-2">
                              {member.role}
                            </Badge>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </div>
              
              {/* Форма ввода (только для чатов) */}
              {activeTab === 'chats' && (
                <div className="p-3 border-top">
                  <Form className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Введите сообщение..."
                      className="me-2"
                    />
                    <Button variant="primary">Отправить</Button>
                  </Form>
                </div>
              )}
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h4 className="text-muted">
                {activeTab === 'chats' 
                  ? 'Выберите чат' 
                  : 'Выберите команду'}
              </h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}