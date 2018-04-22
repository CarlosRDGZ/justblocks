const formNewAnnouncement = document.getElementById('newAnnouncement');
const creationInput = document.getElementById('creationDate');
const evaluationInput = document.getElementById('evaluationDate');
const deadLineInput = document.getElementById('deadLineDate');
const evaluatorsAmountInput = document.getElementById('evaluatorsAmount');
const projectsInput = document.getElementById('projectsByEvaluator');
const contentInput = document.getElementById('content');

formNewAnnouncement.addEventListener('submit', function(ev) {
	ev.preventDefault();
	window.axios.post("/announcement/announcement", { 
						creationDate: creationInput.value, 
						evaluationDate: evaluationInput.value,
						evaluatorsAmount: Number(evaluatorsAmountInput.value),
						projectsByEvaluator: Number(projectsInput.value),
						content: contentInput.value,
						deadlineDate: deadLineInput.value
					}).
		then(({data})=> {
			if(!data['err']) {
				window.location = "/app";
			}
			else
			{
				alert(data['err']);
			}
		})
})