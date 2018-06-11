const url = 'http://127.0.0.1:3000/';

const vm = new Vue({
	el: '#notifications',
	data: {
		notifications: []
	},
	created: function() {
		window.axios.get(`${url}api/notification/${idUser}`)
			.then(({data}) => {
				console.log(data);
				this.notifications = data;
			})
			.catch(err => {console.log(err);})
	},
	methods: {
		get: function(id) {return document.getElementById(id);},
		deleteNotification: function(not) {
			window.axios.delete(`${url}api/notification/${not._id}`)
				.then(({data}) => {
					this.notifications = this.notifications.filter(e => e._id != not._id);
					
					let child = this.get(`not${not._id}`);
					if(child) {
						child.remove();
						let count = this.get("notificationsCount");
						let num = count.attributes["data-badge"].value - 1;
						if(num > 0)
							count.setAttribute('data-badge', num);
						else 
							count.removeAttribute('data-badge');
					}
				})
				.catch(err => {console.log(err); alert('Hubo un problema al eliminar la notificación, inténtalo nuevamente');})
		}
	}
})