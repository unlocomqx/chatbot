<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { useChat } from '@ai-sdk/svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	// noinspection ES6UnusedImports
	import * as Alert from '$lib/components/ui/alert';
	import Icon from '@iconify/svelte';

	const { error, input, status, handleSubmit, messages, reload, stop } =
		useChat({
			onFinish(message, { usage, finishReason }) {
				console.log('Usage', usage);
				console.log('FinishReason', finishReason);
			}
		});

	function ucfirst(text: string){
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
</script>

<section class="p-4 flex items-center justify-center w-full h-full">
	<div class="flex flex-col gap-4 w-96 max-w-96">
		{#if $messages.length}
			<ul>
				{#each $messages as message}
					<li class="message-{message.role}">{ucfirst(message.role)}: {message.content}</li>
				{/each}
			</ul>
		{/if}

		{#if $error}
			<div class="mt-4">
				<Alert.Root variant="destructive">
					<Icon icon="ic:baseline-error" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description class="flex flex-col">
						An error occurred.
						<Button
							class="w-fit"
							variant="outline"
							size="sm"
							type="button"
							onclick={() => reload()}
						>
							Retry
						</Button>
					</Alert.Description>
				</Alert.Root>
			</div>
		{/if}

		<form onsubmit={handleSubmit}>
			<div class="flex flex-col gap-1.5">
				<Label for="prompt">How can I help you?</Label>
				<div class="grid w-full gap-2">
					<Textarea bind:value={$input} disabled={$status !== 'ready'} id="prompt"
										placeholder="Type your message here." />
					<div class="flex gap-2">
						<Button type="submit" class="w-full">
							{#if $status === 'submitted' || $status === 'streaming'}
								Submitting...
							{:else}
								Send
							{/if}
						</Button>
						{#if $status === 'submitted' || $status === 'streaming'}
							<Button variant="destructive" type="button" onclick={stop}>
								<Icon icon="ic:baseline-stop" />
							</Button>
						{/if}
					</div>
				</div>
				<p class="text-muted-foreground text-sm">
					Our AI agent will try to answer your question
				</p>
			</div>
		</form>
	</div>
</section>

<style lang="postcss">
	:global(.message-assistant){
		@apply text-cyan-600;
	}
</style>
