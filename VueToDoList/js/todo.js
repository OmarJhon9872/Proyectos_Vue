Vue.component('todolist', {
	data: function(){
		return {
			tooltipCSS: document.querySelector('.tooltiptext'),
			editing: 0,
			selected: 1,
			showing: 1,
			new_task: "",
			nameApp: 'Mis tareas',
			showTask: true,
			tasks: [
				{name: 'Tarea 1', made: false, show: 1},
				{name: 'Tarea 2', made: true, show: 1},
				{name: 'Tarea 3', made: false, show: 1},
				{name: 'Tarea 4', made: true, show: 1},
			]
		}
	},
	methods: {
		validateIsEmptyField: function(task){
			console.log(task);
			if(task.trim().length < 5){
				document.querySelector('.tooltiptext').style.visibility = 'visible';
				setTimeout(function(){
					document.querySelector('.tooltiptext').style.visibility = 'hidden';
				}, 2000);
				return 1;
			}
		},
		addTask: function(){
			/*console.log(this.new_task.trim().length);*/
			if(this.validateIsEmptyField(this.new_task)){return;}
			this.new_task = this.new_task.slice(0, 50);
			this.tasks.unshift({
				name: this.new_task,
				made: false,
				show: 1
			});
			this.new_task = "";
		},
		deleteTask: function(indexTask){
			console.log('Hola desde padre por hijo');
			this.tasks.splice(indexTask, 1);
		},
		visibilityTask: function(option){
			/*option=1(showTodas), option=2(nomades), option=3(mades)*/
			console.log("Mostrando: "+option);
			this.showing = option;
			for(task of this.tasks){
				task.show = option==1 ? 1 :
							option==2 ? !task.made ? 1:0 :
							task.made ? 1:0;
			}
		},
		/*showTodas: function(){
			for(tarea of this.tasks){
				tarea.show = 1;
			}
		},
		nomades: function(){
			for(tarea of this.tasks){
				tarea.show = !tarea.made ? 1:0;
			}
		},
		mades: function(){
			for(tarea of this.tasks){
				tarea.show = tarea.made ? 1:0;
			}
		}*/

	},
	/*beforeCreate, created, beforeMount, mounted,
	beforeUpdate, updated, beforeDestroy, destroyed*/
	/*beforeUpdate: function(){

	},*/
	computed: {
		completed: function(){
			let mades=0,miss=0;
			this.tasks.filter(function(task){
				task.made ? mades++ : miss++;
			});
			text = 'Hechas: '+mades+' | Faltantes: '+miss;
			return [text, miss, mades];
		},
		/*completed: function(){
			return this.tasks.filter(function(task){
				return task.made;
			}).length;
		},
		missing: function(){
			return this.tasks.filter(function(task){
				return !task.made;
			}).length;
		}*/
	},
	template: `
	<div>
		<section class="todoapp">
			<header class="header">
				<h1 v-text="nameApp"></h1>
				<div class="tooltip">
					<input class="new-todo"
							minlength = "5"
							maxlength = "50"
							placeholder="Ingrese nueva tarea"
							autofocus
							v-on:keyup.enter="addTask()"
							v-model="new_task">
					<span class="tooltiptext">Longitud minima 5 caracteres, máxima 50.</span>
				</div>
			</header>
			<section class="main">
				<input id="toggle-all" class="toggle-all" type="checkbox" v-on:click="showTask = !showTask">
				<label for="toggle-all"></label>
				<ul class="todo-list" v-show="showTask" >

					<!-- <simpleTask v-for="(task, index) in tasks" :task="task" :key="index"></simpleTask>-->
					<li v-for="(task, index) in tasks"
						is="simpleTask"
						:task="task"
						:key="index"
						v-on:editingTask="deleteTask(index)"></li>

				</ul>
			</section>

			<footer class="footer">
				<span class="todo-count" v-show="tasks.length">{{ completed[0] }}</span>
				<ul class="filters">
					<li>
						<a @click="selected = 1; visibilityTask(1);" :class="{selected:selected == 1}">All</a>
						<!-- <a class="[selected: isActive]" href="#" @click="">All</a> -->
					</li>
					<li>
						<a @click="selected = 2; visibilityTask(2);" :class="{selected:selected == 2}">No realizadas ({{ completed[1] }})</a>
					</li>
					<li>
						<a @click="selected = 3; visibilityTask(3);" :class="{selected:selected == 3}">Completadas ({{ completed[2] }})</a>
					</li>
				</ul>
			</footer>
		</section>
		<footer class="info">
			<p>Doble clic en tarea para editarla</p>
			<p>Esc para cancelar edición</p>
		</footer>
	</div>
	`
});




Vue.component('simpleTask', {
	props: ['task'],
	data: function(){
		return {
			editing: false,
			lastChange: '',
		}
	},
	template: `
		<li :class="classCompleted" v-show="task.show">
			<div class="view">
				<input class="toggle" type="checkbox" v-model="task.made">

				<label v-text="task.name" v-show="!editing" @dblclick="editAndSave()"></label>
				<label v-show="editing" id="campoEdit">
					<input type="text"
							placeholder="Editando task"
							ref="fieldData"
							minlength = "5"
							maxlength = "50"
							v-model="task.name"
							v-on:keyup.enter="validate()"
							v-on:keyup.esc="recoverChange()"
							v-on:focusout="validateFocus()">
				</label>
				<button class="destroy" v-show="!editing" @click="$emit('editingTask')"></button>
				<button class="destroy2" v-show="!editing" @click="editing=true"></button>
			</div>
			<input class="edit" value="Rule the web">
		</li>
	`,
	methods: {
		validate: function(){
			if(this.$parent.validateIsEmptyField(this.task.name)){return;}
			this.editing=false;
		},
		validateFocus: function(){
			if(this.$parent.validateIsEmptyField(this.task.name)){
				this.task.name = this.lastChange;
			}
			this.editing=false;
		},
		editAndSave: function(){
			this.editing = true;
			this.lastChange = this.task.name;
			this.$nextTick(() => {
				this.$refs.fieldData.focus();
			})
		},
		recoverChange: function(){
			this.task.name = this.lastChange;
			this.editing=false;
		},
	},
	computed: {
		classCompleted: function(){
			return this.task.made ? 'completed': '';
		},
	}
});




var app = new Vue({
	el:"#app"
});
