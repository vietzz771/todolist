import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

// Lấy dữ liệu từ localstorage rồi đưa vào init value của list
const getLocalStorage = () => {
	let list = localStorage.getItem('list');
	if (list) {
		return (list = JSON.parse(list));
	} else {
		return [];
	}
};

function App() {
	const [name, setName] = useState('');
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({
		show: false,
		type: '',
		msg: '',
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) {
			// hiển thị alert khi submit input rỗng
			showAlert(true, 'danger', 'please enter value');
		} else if (name && isEditing) {
			// edit
			setList(
				list.map((item) => {
					if (item.id === editID) {
						return { ...item, title: name };
					}
					return item;
				})
			);
			setName('');
			setEditID(null);
			setIsEditing(false);
			showAlert(true, 'success', 'value changed');
		} else {
			// add item
			showAlert(true, 'success', 'Item Added To The List');
			const newItems = { id: new Date().getTime().toString(), title: name };
			setList([...list, newItems]);
			setName('');
		}
	};

	// gọn code khi xài nhiều lần, và dùng để settimeout
	const showAlert = (show = false, type = '', msg = '') => {
		setAlert({ show, type, msg });
	};

	const clearList = () => {
		showAlert(true, 'danger', 'empty list');
		setList([]);
	};

	// dùng filter để lọc ra tất cả các phần tử khác phần tử được chọn, là 1 cách để xóa item =))
	const removeItem = (id) => {
		showAlert(true, 'danger', 'item removed');
		setList(list.filter((item) => item.id !== id));
	};

	// Tìm ra thằng cần edit nhờ id, và set giá trị title của nó vào value ô input(name)
	const editItem = (id) => {
		const specificItem = list.find((item) => item.id === id);
		setIsEditing(true);
		setEditID(id);
		setName(specificItem.title);
	};

	// Dùng useEffect và truyền deps là list vì khi list thay đổi thì nó sẽ tự động lưu vào chứ không cần set từng cái ở remove, add, ....
	useEffect(() => {
		localStorage.setItem('list', JSON.stringify(list));
	}, [list]);

	return (
		<section className="section-center">
			<form className="grocery-form" onSubmit={handleSubmit}>
				{alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
				<h3>Todo List</h3>
				<div className="form-control">
					<input
						type="text"
						className="grocery"
						placeholder="st..."
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button type="submit" className="submit-btn">
						{isEditing ? 'edit' : 'submit'}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className="grocery-container">
					<div className="grocery-list">
						<List items={list} removeItem={removeItem} editItem={editItem} />
					</div>
					<button className="clear-btn" onClick={clearList}>
						clear items
					</button>
				</div>
			)}
		</section>
	);
}

export default App;
