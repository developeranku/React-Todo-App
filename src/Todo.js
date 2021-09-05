import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Form, InputGroup, Button, FormControl, Col, ListGroup } from 'react-bootstrap';

const ToDoItem = (props) => {
    const { value, index, removeItem } = props;

    return (
        <ListGroup.Item variant="light" style={{ padding: '20px 15px' }}>
            {value}
            <a className="ml-auto text-danger" style={{ float: 'right', textDecoration: 'none' }} href={'/#'} onClick={e => {
                e.preventDefault();
                removeItem(index);
            }} >
                x
            </a>
        </ListGroup.Item>
    )
}

const Todo = () => {
    const itemsPerPage = 10;
    const isMounted = React.useRef(null);
    const [inputVal, setInputVal] = React.useState('');
    const [items, setItems] = React.useState([]);
    const [totalAvailableResults, setTotalAvailableResults] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        /* populateItemsInLocalStorage(50); */
        isMounted.current = true;
        /* Fetch items saved in localstorage */
        fetchItemsFromStorage();
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        if (!isMounted) {
            return null;
        }
        fetchMoreItems();
        // eslint-disable-next-line
    }, [currentPage])

    /* This function can be used to add todo items  */
    // eslint-disable-next-line
    const populateItemsInLocalStorage = (index) => {
        let i = 0;
        const items = [];
        for (i; i < index; i++) {
            items.push(i.toString());
        }
        localStorage.setItem('todoList', JSON.stringify(items));
    }

    const fetchItemsFromStorage = () => {
        const storedItems = localStorage.getItem('todoList');
        if (!storedItems) {
            return null;
        }
        /* Set Available Results Length */
        setTotalAvailableResults(storedItems.length);
        /* Filter Data */
        const offset = (currentPage - 1) * itemsPerPage;
        setItems(JSON.parse(storedItems).slice(offset).splice(0, itemsPerPage));
    }

    const fetchMoreItems = () => {
        console.log('Fetching more items')
        const storedItems = localStorage.getItem('todoList');
        if (!storedItems) {
            return null;
        }
        /* Set Available Results Length */
        setTotalAvailableResults(JSON.parse(storedItems).length);
        /* Filter Data */
        const offset = (currentPage - 1) * itemsPerPage;
        setItems(items.concat(JSON.parse(storedItems).slice(offset).splice(0, itemsPerPage)));
    }

    const addItemInList = (e) => {
        e.preventDefault();
        if (!inputVal) {
            alert('Please enter a value');
            return;
        }
        items.unshift(inputVal)
        setItems(items);
        setInputVal('');

        /* Mutation in localStorage */
        const storedItems = localStorage.getItem('todoList');
        if (!storedItems) {
            localStorage.setItem('todoList', JSON.stringify([inputVal]));
            return null;
        }
        const newValues = JSON.parse(storedItems);
        newValues.push(inputVal)
        localStorage.setItem('todoList', JSON.stringify(newValues));
    }

    const removeItem = (index) => {
        /* Mutation in state */
        const newArr = items.filter((data, i) => i !== index);
        setItems(newArr);

        /* Mutation in localStorage */
        const storedItems = localStorage.getItem('todoList');
        const parsed = JSON.parse(storedItems);
        const newLocalItems = parsed.filter((data, i) => i !== index);
        localStorage.setItem('todoList', JSON.stringify(newLocalItems));
    }

    return (
        <Container className="mt-5">
            <Col md={6} className="m-auto" onSubmit={addItemInList}>
                <Form>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Task</InputGroup.Text>
                        <FormControl
                            placeholder="Enter your task"
                            name="task"
                            onChange={e => setInputVal(e.target.value)}
                            value={inputVal}
                        />
                        <Button type="submit">
                            Create Task
                        </Button>
                    </InputGroup>
                </Form>
                <div className="mt-4">
                    {items.length ? (
                        <InfiniteScroll
                            next={(i, p) => {
                                setCurrentPage(currentPage + 1);
                            }}
                            dataLength={items.length}
                            endMessage={
                                <p style={{ textAlign: 'center', marginTop: 20 }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            hasMore={totalAvailableResults > items.length}
                        >
                            <ListGroup>
                                {
                                    items.map((val, i) => {
                                        return (
                                            <ToDoItem
                                                value={val}
                                                key={i}
                                                index={i}
                                                removeItem={removeItem}
                                            />
                                        )
                                    })
                                }
                            </ListGroup>
                        </InfiniteScroll>
                    ) : (
                        <p>Please add first item</p>
                    )}
                </div>
            </Col>
        </Container>
    )
}

export default Todo;